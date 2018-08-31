module.exports = function(env) {
    if (env === 'dev' || 'prod') {
        return require('./webpack.' + `${env}`);
    } else {
        console.error(`Mode: ${env} \n Allowed modes are prod or dev.`)
    }
}