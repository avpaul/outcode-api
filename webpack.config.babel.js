export default (env) => {
  if (env === 'dev' || env === 'prod') {
    return require(`./webpack.${env}`);
  }
  console.error(`Mode: ${env} \n Allowed modes are prod or dev.`);
  return null;
};
