// buildroot update files
import path from 'path'
import { readFile, ensureDir } from 'fs-extra'
import { app } from 'electron'

import { UI_INITIALIZED } from '@opentrons/app/src/redux/shell/actions'
import { createLogger } from '../log'
import { getConfig } from '../config'
import { CURRENT_VERSION } from '../update'
import { downloadManifest, getReleaseSet } from './release-manifest'
import {
  getReleaseFiles,
  readUserFileInfo,
  cleanupReleaseFiles,
} from './release-files'
import { startPremigration, uploadSystemFile } from './update'

import type { DownloadProgress } from '../http'
import type { Action, Dispatch } from '../types'
import type { ReleaseSetUrls, ReleaseSetFilepaths } from './types'
import type {
  BuildrootUpdateInfo,
  BuildrootAction,
} from '@opentrons/app/src/redux/buildroot/types'
import type { RobotHost } from '@opentrons/app/src/redux/robot-api/types'

const log = createLogger('buildroot/index')

const DIRECTORY = path.join(app.getPath('userData'), '__ot_buildroot__')
const MANIFEST_CACHE = path.join(DIRECTORY, 'releases.json')

let checkingForUpdates = false
let updateSet: ReleaseSetFilepaths | null = null

export function registerBuildrootUpdate(dispatch: Dispatch): Dispatch {
  return function handleAction(action: Action) {
    switch (action.type) {
      case UI_INITIALIZED:
      case 'shell:CHECK_UPDATE':
        if (!checkingForUpdates) {
          checkingForUpdates = true
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          checkForBuildrootUpdate(dispatch).then(
            () => (checkingForUpdates = false)
          )
        }
        break

      case 'buildroot:START_PREMIGRATION': {
        const robot = action.payload as RobotHost

        log.info('Starting robot premigration', { robot })

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        startPremigration(robot)
          .then(
            (): BuildrootAction => ({
              type: 'buildroot:PREMIGRATION_DONE',
              payload: robot.name,
            })
          )
          .catch(
            (error: Error): BuildrootAction => ({
              type: 'buildroot:PREMIGRATION_ERROR',
              payload: { message: error.message },
            })
          )
          .then(dispatch)

        break
      }

      case 'buildroot:UPLOAD_FILE': {
        const { host, path, systemFile } = action.payload
        const file = systemFile !== null ? systemFile : updateSet?.system

        if (file == null) {
          return dispatch({
            type: 'buildroot:UNEXPECTED_ERROR',
            payload: { message: 'Buildroot update file not downloaded' },
          })
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        uploadSystemFile(host, path, file)
          .then(() => ({
            type: 'buildroot:FILE_UPLOAD_DONE' as const,
            payload: host.name,
          }))
          .catch((error: Error) => {
            log.warn('Error uploading update to robot', { path, file, error })

            return {
              type: 'buildroot:UNEXPECTED_ERROR' as const,
              payload: {
                message: `Error uploading update to robot: ${error.message}`,
              },
            }
          })
          .then(dispatch)

        break
      }

      case 'buildroot:READ_USER_FILE': {
        const { systemFile } = action.payload as { systemFile: string }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        readUserFileInfo(systemFile)
          .then(userFile => ({
            type: 'buildroot:USER_FILE_INFO' as const,
            payload: {
              systemFile: userFile.systemFile,
              version: userFile.versionInfo.opentrons_api_version,
            },
          }))
          .catch((error: Error) => ({
            type: 'buildroot:UNEXPECTED_ERROR' as const,
            payload: { message: error.message },
          }))
          .then(dispatch)

        break
      }
    }
  }
}

export function getBuildrootUpdateUrls(): Promise<ReleaseSetUrls | null> {
  const manifestUrl: string = getConfig('robotSystemUpdate').manifestUrls[
    _DEFAULT_ROBOT_UPDATE_SOURCE_CONFIG_SELECTION_
  ]

  return downloadManifest(manifestUrl, MANIFEST_CACHE)
    .then(manifest => {
      const urls = getReleaseSet(manifest, CURRENT_VERSION)

      if (urls === null) {
        log.warn('No release files in manifest', {
          version: CURRENT_VERSION,
          manifest,
        })
      }

      return urls
    })
    .catch((error: Error) => {
      log.warn('Error retrieving release manifest', {
        version: CURRENT_VERSION,
        error,
      })

      return null
    })
}

// check for a buildroot update matching the current app version
//   1. Ensure the buildroot directory exists
//   2. Download the manifest file from S3
//   3. Get the release files according to the manifest
//      a. If the files need downloading, dispatch progress updates to UI
//   4. Cache the filepaths of the update files in memory
//   5. Dispatch info or error to UI
export function checkForBuildrootUpdate(dispatch: Dispatch): Promise<unknown> {
  const fileDownloadDir = path.join(DIRECTORY, CURRENT_VERSION)

  return ensureDir(fileDownloadDir)
    .then(getBuildrootUpdateUrls)
    .then(urls => {
      if (urls === null) return Promise.resolve()

      dispatch({ type: 'buildroot:UPDATE_VERSION', payload: CURRENT_VERSION })

      let prevPercentDone = 0

      const handleProgress = (progress: DownloadProgress): void => {
        const { downloaded, size } = progress
        if (size !== null) {
          const percentDone = Math.round((downloaded / size) * 100)

          if (Math.abs(percentDone - prevPercentDone) > 0) {
            dispatch({
              type: 'buildroot:DOWNLOAD_PROGRESS',
              payload: percentDone,
            })
            prevPercentDone = percentDone
          }
        }
      }

      return getReleaseFiles(urls, fileDownloadDir, handleProgress)
        .then(filepaths => cacheUpdateSet(filepaths))
        .then(updateInfo =>
          dispatch({ type: 'buildroot:UPDATE_INFO', payload: updateInfo })
        )
        .catch((error: Error) =>
          dispatch({ type: 'buildroot:DOWNLOAD_ERROR', payload: error.message })
        )
        .then(() => cleanupReleaseFiles(DIRECTORY, CURRENT_VERSION))
        .catch((error: Error) => {
          log.warn('Unable to cleanup old release files', { error })
        })
    })
}

function cacheUpdateSet(
  filepaths: ReleaseSetFilepaths
): Promise<BuildrootUpdateInfo> {
  updateSet = filepaths

  return readFile(updateSet.releaseNotes, 'utf8').then(releaseNotes => ({
    version: CURRENT_VERSION,
    releaseNotes,
  }))
}
