dev :
	RAILS_ENV=development rails server
compile:
	RAILS_ENV=production bin/rake assets:precompile
prod :
	SECRET_KEY_BASE=fuckyou RAILS_SERVE_STATIC_FILES=true RAILS_ENV=production rails server
load:
	rake db:drop
	rake db:schema:load
	rake db:seed
	rails runner scripts/load-old-data.rb 
