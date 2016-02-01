export const postgresPassword = 'test123';

const skylinkKeys = {
  'local': '44759962-822a-42db-9de2-39a31bf25675',
  'prod': 'afb81484-be2f-4578-b6de-da7deaf94082',
};

export function getKey() {
  return location.host === 'oconf.com' ? skylinkKeys.prod : skylinkKeys.local;
}