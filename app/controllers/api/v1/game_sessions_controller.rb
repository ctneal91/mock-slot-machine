class Api::V1::GameSessionsController < ApplicationController
  before_action :set_game_session, only: [ :show, :roll, :cash_out ]

  # POST /api/v1/game_sessions
  def create
    @game_session = GameSession.new
    if @game_session.save
      render json: session_response, status: :created
    else
      render json: { errors: @game_session.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/game_sessions/:session_token
  def show
    render json: session_response
  end

  # POST /api/v1/game_sessions/:session_token/roll
  def roll
    if @game_session.cashed_out
      render json: { error: "Session has been cashed out" }, status: :unprocessable_entity
      return
    end

    if @game_session.credits < 1
      render json: { error: "Insufficient credits" }, status: :unprocessable_entity
      return
    end

    slot_machine = SlotMachine.new(@game_session)
    result = slot_machine.spin!

    render json: {
      result: result[:result],
      win: result[:win],
      reward: result[:reward],
      credits: result[:credits]
    }
  end

  # POST /api/v1/game_sessions/:session_token/cash_out
  def cash_out
    if @game_session.cashed_out
      render json: { error: "Session already cashed out" }, status: :unprocessable_entity
      return
    end

    credits_cashed = @game_session.credits
    @game_session.update!(cashed_out: true)

    render json: {
      message: "Successfully cashed out",
      credits_cashed: credits_cashed,
      session_token: @game_session.session_token
    }
  end

  private

  def set_game_session
    @game_session = GameSession.find_by!(session_token: params[:session_token])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Session not found" }, status: :not_found
  end

  def session_response
    {
      session_token: @game_session.session_token,
      credits: @game_session.credits,
      cashed_out: @game_session.cashed_out
    }
  end
end
