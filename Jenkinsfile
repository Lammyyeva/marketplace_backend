pipeline {
    agent any

    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'ref', value: '$.ref']
            ],
            causeString: 'Triggered by Gitea',
            token: 'e89090702126542ab2399e983c792f5990e94d2e',
            printContributedVariables: true,
            printPostContent: true
        )
    }

    stages {
        stage('Check branch') {
            when {
                expression {
                    return env.ref == 'refs/heads/main'
                }
            }
            steps {
                echo "Main branch push detected 🚀"
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                cd /var/www/app
                git pull origin main
                pm2 restart app
                '''
            }
        }
    }
}