const secretInfo = require('./secret');
module.exports = {
    deploy: {
    // "production" is the environment name
        production: {
            // SSH key path, default to $HOME/.ssh
            ...secretInfo,
            // SSH options with no command-line flag, see 'man ssh'
            // can be either a single string or an array of strings
            ssh_options: 'StrictHostKeyChecking=no',
            // GIT remote/branch
            ref: 'origin/test',
            // GIT remote
            repo: 'https://github.com/vitelabs/vite-web-wallet.git',
            // path in the server
            path: '/home/ubuntu/wallet',
            // Pre-setup command or path to a script on your local machine
            //   // Post-setup commands or path to a script on the host machine
            //   // eg: placing configurations in the shared dir etc
            'post-setup': 'ls -la',
            // pre-deploy action
            //   pre-deploy-local: "echo 'This is a local executed command'"
            // post-deploy action
            'post-deploy':
                'npm install && NODE_ENV=production npm run build'
        }
    }
};
