pipeline {
    agent any

    tools {
        nodejs "node"  // 确保已经在 Jenkins 中配置了 NodeJS 插件和环境
    }

    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                // 添加部署到服务器的脚本
                echo 'Deploying...'
            }
        }
    }
}
