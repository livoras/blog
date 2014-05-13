#!/bin/bash
if [ "$1" = "" ]
then
	python app.py & 
	cd static && grunt &
	sniffer &
elif [ "$1" = "deploy" ]	
then	
  cp dev-tools/fixture/.gitignore .gitignore
  origin="heroku"

	if [ "$2" = "huasheng" ]
	then
    cp dev-tools/fixture/config-huasheng.py config.py
    origin="huasheng"
	fi

  echo "Pushing to $origin...."

  python dev-tools/deploy.py
  cd static && grunt build && cd ../
  git add -A
  git commit -am 'deploy'
  git push $origin master -f
  git reset --hard HEAD^
fi
