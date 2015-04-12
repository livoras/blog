json.array!(@posts) do |post|
  json.extract! post, :id
  json.url post_url(post, format: :json)
end
