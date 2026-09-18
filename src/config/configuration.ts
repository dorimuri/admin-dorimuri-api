export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  kafka: {
    AUTH: { LOGIN: 'auth.login', VERIFY: 'auth.verify' },
  },
});
