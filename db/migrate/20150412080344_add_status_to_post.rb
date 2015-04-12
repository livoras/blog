class AddStatusToPost < ActiveRecord::Migration
  def change
    add_column :posts, :status, :string, :default => :public
  end
end
