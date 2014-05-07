function swap() {
  cp .gitignore tmp
  cp dev-tools/fixture/.gitignore .gitignore
  cp tmp dev-tools/fixture/.gitignore
  rm tmp
}

if [ "$1" = "" ]
then
	python app.py & 
	cd static && grunt &
	sniffer &
elif [ "$1" = "deploy" ]	
then	
	cp blog.db ../
  swap
  python dev-tools/deploy.py
  cd static && grunt build && cd ../
  git add -A
  git commit -am 'deploy'
  git push heroku master -f
  git reset --hard HEAD^
  mv ../blog.db .
fi
