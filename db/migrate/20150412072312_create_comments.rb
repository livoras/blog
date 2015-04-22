class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :email
      t.string :content
      t.string :name

      t.timestamps null: false
    end
  end
end
