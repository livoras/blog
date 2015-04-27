dev :
	RAILS_ENV=development rails server
compile:
	RAILS_ENV=production bin/rake assets:precompile
prod :
	RAILS_DB_NAME=blog RAILS_DB_USER=blog RAILS_DB_PASSWORD=111111 RAILS_ENV=production SECRET_KEY_BASE=averysecretkey RAILS_SERVE_STATIC_FILES=true RAILS_ENV=production rails server
launch:
	git pull origin
	make compile
	apachectl restart
