class Api::V1::UsersController < ApplicationController
    protect_from_forgery unless: -> { request.format.json? }

    def show
      user = User.find(params[:id])
      render json: user
    end
end

  
