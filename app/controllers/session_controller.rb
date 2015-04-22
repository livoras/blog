class SessionController < ApplicationController
  skip_before_action :authentication, only: [:new, :create]

  def create
    user = User.authenticate(params[:email], params[:password])
    if user.nil?
      flash[:error] = 'Login failed!'
      redirect_to login_url
    else
      session[:user_id] = user.id
      flash[:notice] = 'Login successfully!'
      redirect_to root_url
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

  def new
  end
end
