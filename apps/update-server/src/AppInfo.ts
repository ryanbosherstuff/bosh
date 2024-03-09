/**
 * The shape of the request body sent by the app. We have no control over this.
 */
export interface AppInfo {
  platform: string,
  device_id: string,
  app_id: string,
  custom_id: string,
  plugin_version: string,
  version_build: string,
  version_code: string,
  version_name: string | 'builtin',
  version_os: string,
  is_emulator: boolean,
  is_prod: boolean,
  defaultChannel: string
}
