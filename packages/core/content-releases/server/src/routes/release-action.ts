export default {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/:releaseId/actions',
      handler: 'release-action.create',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::content-releases.create-action'],
            },
          },
        ],
      },
    },
    {
      method: 'PUT',
      path: '/:releaseId/actions/:actionId',
      handler: 'release-action.update',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::content-releases.update-action'],
            },
          },
        ],
      },
    },
  ],
};
