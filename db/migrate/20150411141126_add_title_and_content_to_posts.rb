class AddTitleAndContentToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :title, :string
    add_column :posts, :content, :string
  end
end
