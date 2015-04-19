class AddTitleAndContentToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :title, :text
    add_column :posts, :content, :text
  end
end
