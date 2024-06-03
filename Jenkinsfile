pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    def checkoutTimeout = 20
                    git branch: 'master',
                        url: 'https://github.com/HyxiaoGe/xiaohub.git',
                        credentialsId: 'login_credentials',
                        timeout: checkoutTimeout
                }
            }
        }
        stage('Prepare') {
            steps {
                echo 'Checking Node.js and NPM versions...'
                sh 'node -v'
                sh 'npm -v'
            }
        }
        stage('Install Dependencies') {
            steps {
                echo 'Installing NPM dependencies...'
                sh 'npm install'
            }
        }
    }
}