#!/bin/bash
if [ -z $1 ]
then
    echo "No Parameter Passed..."
elif [ $1 = "local" ] || [ $1 = "development" ] || [ $1 = "production" ]
then
    echo "Start $1"
    echo "Shut Down pm2"
    pm2 delete all
    echo "Start pm2"
    npm run $1
    echo "End"
else
    echo "Wrong parameters"
    echo "'local','development', 'production'"
fi