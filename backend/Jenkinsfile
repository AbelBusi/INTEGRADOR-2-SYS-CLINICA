pipeline {
    agent any

    tools {
        jdk 'JDK21'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'develop', url: 'https://github.com/AbelBusi/SOFTWARE-CONSULTORIO-MEDICO.git'
            }
        }

        stage('Build & Test') {
            steps {
                dir('consultorio') {
                    bat '.\\mvnw.cmd clean verify'
                }
            }
            post {
                always {
                    junit 'consultorio/target/surefire-reports/*.xml'
                }
            }
        }
    }
}
