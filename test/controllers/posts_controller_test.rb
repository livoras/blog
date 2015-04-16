require 'test_helper'

class PostsControllerTest < ActionController::TestCase
  setup do
    @post = posts(:one)
    @post.tags.build :name => "fuck"
    @post.tags.build :name => "you"
    @post.save
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:posts)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create post" do
    assert_differences([['Post.count', 1], ['Tag.count', 2]]) do
      post :create, post: {tags: 'new;tags;', content: 'jerry', title: 'title'}
    end
    assert_redirected_to post_path(assigns(:post))
  end

  test "should only one tag model even with multiple same name tag" do
    post :create, post: {tags: 'onlyone;onlyone;onlyone2', content: 'jerry', title: 'title'}
    assert_equal 1, Tag.where(:name => 'onlyone').count
    assert_equal 1, Tag.where(:name => 'onlyone2').count
  end

  test "should exist same name tag in different post" do
    post :create, post: {tags: 'newtag'}
    post :create, post: {tags: 'newtag'}
    post :create, post: {tags: 'newtag'}
    assert_equal 3, Tag.where(:name => 'newtag').count
  end

  test "delete post and its tags will also be deleted" do
    delete :destroy, id: @post
    assert Tag.find_by(:name => 'fuck').nil?, 'Tag should be deleted, but not.'
    assert Tag.find_by(:name => 'you').nil?, 'Tag should be deleted, but not.'
  end

  test "should show post" do
    get :show, id: @post
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @post
    assert_response :success
  end

  test "should update post" do
    assert_difference('Tag.count', 1) do
      patch :update, id: @post.id, post: {:title => "shit", :content => "you", :tags => "lucy;good;yes;"}
    end
    assert !Tag.exists?(:name => 'fuck')
    assert Tag.exists?(:name => 'lucy')
    post = assigns(:post)
    assert_equal 3, post.tags.count
    assert_equal post.all_tags, ["lucy", "good", "yes"]
    assert_redirected_to post_path(assigns(:post))
  end


  test "should destroy post" do
    assert_difference('Post.count', -1) do
      delete :destroy, id: @post
    end

    assert_redirected_to posts_path
  end
end
