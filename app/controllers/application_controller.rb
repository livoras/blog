class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :current_user, :authentication

  private 
    def current_user
      begin
        @user = User.find(session[:user_id])
      rescue ActiveRecord::RecordNotFound
        @user = nil
      end
    end

    def authentication
      unless session[:user_id] and User.exists?(session[:user_id])
        redirect_to login_url
      end
    end
end
