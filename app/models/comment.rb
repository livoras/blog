class Comment < ActiveRecord::Base
  belogs_to :post
end
