class Api::V1::NotesController < ApplicationController
    protect_from_forgery unless: -> { request.format.json? }

    def create
        note = Note.new(note_params)
        if note.save
            render json: { note: note }
        else
            render json: { error: note.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
      is_admin = current_user.admin
        note_by_current_user = current_user.notes.exists?(params[:id])
      if note_by_current_user || is_admin
        note = Note.find(params[:id])
        trail = note.trail
        note.delete
        render json: trail
      end
    end

    def note_params
        params.require(:note).permit(:note, :user_id, :trail_id)
    end
end
