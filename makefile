dev :
	RAILS_ENV=development rails server
compile:
	RAILS_ENV=production bin/rake assets:precompile
