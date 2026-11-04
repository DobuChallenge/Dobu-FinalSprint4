import Constants from 'expo-constants';

export const buildInfo = {
  version: Constants.expoConfig?.version || 'Não informada',
  commit: Constants.expoConfig?.extra?.buildCommit || 'desenvolvimento',
};
