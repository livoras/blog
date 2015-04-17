class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :set_tags
  before_action :set_status_filter
  skip_before_action :authentication, only: [:index, :show, :search_by_tag, :search_by_keyword]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.where(status: @status)
                 .paginate(:page => params[:page], :per_page => 7)
                 .order("created_at DESC")
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
  end

  # GET /posts/new
  def new
    @post = Post.new
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts
  # POST /posts.json
  def create
    @post = Post.new(post_params)
    respond_to do |format|
      if @post.save
        format.html { redirect_to @post, notice: 'Post was successfully created.' }
        format.json { render :show, status: :created, location: @post }
      else
        format.html { render :new }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    @post.tags.each { |tag| tag.destroy }
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to @post, notice: 'Post was successfully updated.' }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_url, notice: 'Post was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def search_by_tag
    @posts = find_post_by_tag_name params[:name]
    respond_to do |format|
      format.html {render :index}
    end
  end

  def search_by_keyword
    pattern = "'%#{params[:keyword]}%'"

    @posts = Post.where("content LIKE #{pattern} OR title LIKE #{pattern}")
                 .where(status: @status)
                 .paginate(:page => params[:page], :per_page => 7)
                 .order("posts.created_at DESC")
    respond_to do |format|
      format.html {render :index}
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      post_args = params[:post].permit(:content, :title, :tags, :status)
      post_args[:user_id] = session[:user_id]
      convert_tags_to_list post_args
    end

    def convert_tags_to_list(post_args)
      post_args[:tags] = post_args[:tags].split(';').map do |tagName|
        tag = Tag.find_by(:name => tagName, :post_id => params[:id])
        if tag.nil?
          tag = Tag.create name: tagName
        end
        tag
      end
      post_args
    end

    def set_tags
      @tags = Tag.group(:name).count
    end

    def set_status_filter
      if @user
        @status = ['private', 'public']
      else
        @status = ['public']
      end
    end

    def find_post_by_tag_name(tag_name)
      Post.includes(:tags)
          .where(tags: {name: tag_name}, status: @status)
          .paginate(:page => params[:page], :per_page => 7)
          .order("posts.created_at DESC")
    end
end
