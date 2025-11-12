/** @type {import('detox').DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      _: ['e2e']
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'ios.sim': {
      type: 'ios.app',
      binaryPath: 'bin/BabyNames.app',
      build: 'expo run:ios --configuration Debug --no-install',
      device: {
        type: 'iPhone 15'
      }
    },
    'android.emu': {
      type: 'android.apk',
      binaryPath: 'bin/BabyNames.apk',
      build: 'expo run:android --variant debug --no-install',
      device: {
        avdName: 'Pixel_6_API_34'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'ios.sim',
      app: 'ios.sim'
    },
    'android.emu.debug': {
      device: 'android.emu',
      app: 'android.emu'
    }
  }
};
