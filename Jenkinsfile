pipeline {
    agent any

    tools {
        nodejs 'node'  // 确保与 Jenkins 配置中的 NodeJS 名称匹配
    }

    stages {
        stage('Prepare') {
            steps {
                echo 'Checking Node.js and NPM versions...'
                sh 'node -v'
                sh 'npm -v'
            }
        }
    }
}
