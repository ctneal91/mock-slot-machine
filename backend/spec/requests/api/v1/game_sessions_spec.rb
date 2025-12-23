require 'rails_helper'

RSpec.describe "Api::V1::GameSessions", type: :request do
  describe "POST /api/v1/game_sessions" do
    it "creates a new game session with 10 credits" do
      post "/api/v1/game_sessions"

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)

      expect(json['session_token']).to be_present
      expect(json['credits']).to eq(10)
      expect(json['cashed_out']).to be(false)
    end

    it "creates unique session tokens" do
      post "/api/v1/game_sessions"
      token1 = JSON.parse(response.body)['session_token']

      post "/api/v1/game_sessions"
      token2 = JSON.parse(response.body)['session_token']

      expect(token1).not_to eq(token2)
    end
  end

  describe "GET /api/v1/game_sessions/:session_token" do
    it "returns the session details" do
      game_session = create(:game_session, credits: 15)

      get "/api/v1/game_sessions/#{game_session.session_token}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json['session_token']).to eq(game_session.session_token)
      expect(json['credits']).to eq(15)
      expect(json['cashed_out']).to be(false)
    end

    it "returns 404 for non-existent session" do
      get "/api/v1/game_sessions/nonexistent_token"

      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json['error']).to eq("Session not found")
    end
  end

  describe "POST /api/v1/game_sessions/:session_token/roll" do
    it "returns roll result with 3 symbols" do
      game_session = create(:game_session, credits: 10)

      post "/api/v1/game_sessions/#{game_session.session_token}/roll"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json['result']).to be_an(Array)
      expect(json['result'].length).to eq(3)
      expect(json['result']).to all(be_in(%w[C L O W]))
      expect(json).to have_key('win')
      expect(json).to have_key('reward')
      expect(json).to have_key('credits')
    end

    it "deducts credits after roll" do
      game_session = create(:game_session, credits: 10)

      post "/api/v1/game_sessions/#{game_session.session_token}/roll"

      json = JSON.parse(response.body)
      game_session.reload

      if json['win']
        expect(game_session.credits).to eq(10 + json['reward'] - 1)
      else
        expect(game_session.credits).to eq(9)
      end
    end

    it "returns error when session has no credits" do
      game_session = create(:game_session, :no_credits)

      post "/api/v1/game_sessions/#{game_session.session_token}/roll"

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json['error']).to eq("Insufficient credits")
    end

    it "returns error when session is cashed out" do
      game_session = create(:game_session, :cashed_out)

      post "/api/v1/game_sessions/#{game_session.session_token}/roll"

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json['error']).to eq("Session has been cashed out")
    end

    it "returns 404 for non-existent session" do
      post "/api/v1/game_sessions/nonexistent_token/roll"

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/game_sessions/:session_token/cash_out" do
    it "cashes out the session and returns credits" do
      game_session = create(:game_session, credits: 25)

      post "/api/v1/game_sessions/#{game_session.session_token}/cash_out"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json['message']).to eq("Successfully cashed out")
      expect(json['credits_cashed']).to eq(25)
      expect(json['session_token']).to eq(game_session.session_token)

      game_session.reload
      expect(game_session.cashed_out).to be(true)
    end

    it "returns error when session is already cashed out" do
      game_session = create(:game_session, :cashed_out)

      post "/api/v1/game_sessions/#{game_session.session_token}/cash_out"

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json['error']).to eq("Session already cashed out")
    end

    it "returns 404 for non-existent session" do
      post "/api/v1/game_sessions/nonexistent_token/cash_out"

      expect(response).to have_http_status(:not_found)
    end
  end
end
