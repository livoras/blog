dev :
	RAILS_ENV=development rails server
compile:
	RAILS_ENV=production bin/rake assets:precompile
prod :
	RAILS_DB_NAME=blog RAILS_DB_USER=blog RAILS_DB_PASSWORD=111111 RAILS_ENV=production SECRET_KEY_BASE=fuckyou RAILS_SERVE_STATIC_FILES=true RAILS_ENV=production rails server
load:
	rake db:drop
	rake db:create
	rake db:schema:load
	rake db:seed
	rails runner scripts/load-old-data.rb
launch:
	git pull origin
	make compile
	apachectl restart
