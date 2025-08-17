// config/plugins.js
module.exports = ({ env }) => ({
    graphql: {
      config: {
        endpoint: '/graphql',
        shadowCRUD: true, // Автоматично генерує GraphQL схему для твоїх типів контенту
        landingPage: env('NODE_ENV') !== 'production', // GraphQL Playground увімкнено в non-production
        depthLimit: 10, // Ліміт вкладеності запитів
        amountLimit: 100, // Ліміт елементів у відповіді
      },
    },
  });