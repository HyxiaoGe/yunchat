pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    retry(3) {
                        timeout(time: 5, unit: 'MINUTES') {
                            git branch: 'master',
                                url: 'https://github.com/HyxiaoGe/xiaohub.git',
                                credentialsId: 'login_credentials'
                        }
                    }
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
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm run build'
            }
        }
        stage('Deployment') {
            steps {
                echo 'Deploying to Nginx directory...'
                sh 'rm -rf /docker/nginx/data/html/xiaohub/*'  // 清理旧文件
                sh 'cp -r dist/* /docker/nginx/data/html/xiaohub/'  // 复制新文件
                sh 'sudo docker restart nginx'  // 重载 Nginx
            }
        }
    }
    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}