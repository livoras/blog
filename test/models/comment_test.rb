require 'test_helper'

class CommentTest < ActiveSupport::TestCase

  setup do
    @comment = Comment.new email: 'fuck', name: 'jerry', content: 'good'
  end

  test 'Should validate email' do
    @comment.valid?
    assert_equal @comment.errors[:email], ['email is not valid']

    @comment.email = "fuck@163.com"
    @comment.valid?
    assert_equal @comment.errors[:email], []

    @comment.email = ""
    @comment.valid?
    assert_equal @comment.errors[:email], ["can't be blank", "email is not valid"]
  end

  test 'content cannot be blank' do
    @comment.email = "fuck@163.com"
    @comment.content = ""
    @comment.valid?
    assert_equal @comment.errors[:content], ["can't be blank"]
  end

  test 'name cannot be in range' do
    @comment.name = "h"
    @comment.valid?
    assert_equal @comment.errors[:name].size, 1

    @comment.name = "newname"
    @comment.valid?
    assert_equal @comment.errors[:name], []

    @comment.name = "newnamnnewnamenewnameewnamenewnamenewnamenewnamenewnamee"
    @comment.valid?
    assert_equal @comment.errors[:name].size, 1
  end
end
