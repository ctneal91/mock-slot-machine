require 'rails_helper'

RSpec.describe GameSession, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:credits) }
    it { should validate_numericality_of(:credits).is_greater_than_or_equal_to(0) }

    it 'validates uniqueness of session_token' do
      create(:game_session)
      should validate_uniqueness_of(:session_token)
    end

    it 'requires session_token to be present (auto-generated before validation)' do
      game_session = GameSession.new
      game_session.valid?
      expect(game_session.session_token).to be_present
    end
  end

  describe 'callbacks' do
    it 'generates a session token before validation on create' do
      game_session = GameSession.new
      game_session.valid?
      expect(game_session.session_token).to be_present
      expect(game_session.session_token.length).to eq(32)
    end

    it 'does not overwrite existing session token' do
      existing_token = 'existing_token_123'
      game_session = GameSession.new(session_token: existing_token)
      game_session.valid?
      expect(game_session.session_token).to eq(existing_token)
    end
  end

  describe 'defaults' do
    it 'has 10 credits by default' do
      game_session = GameSession.create!
      expect(game_session.credits).to eq(10)
    end

    it 'is not cashed out by default' do
      game_session = GameSession.create!
      expect(game_session.cashed_out).to be(false)
    end
  end

  describe '#can_play?' do
    it 'returns true when session has credits and is not cashed out' do
      game_session = create(:game_session, credits: 5, cashed_out: false)
      expect(game_session.can_play?).to be(true)
    end

    it 'returns false when session has no credits' do
      game_session = create(:game_session, :no_credits)
      expect(game_session.can_play?).to be(false)
    end

    it 'returns false when session is cashed out' do
      game_session = create(:game_session, :cashed_out)
      expect(game_session.can_play?).to be(false)
    end
  end

  describe '.active' do
    it 'returns only sessions that are not cashed out' do
      active_session = create(:game_session, cashed_out: false)
      cashed_out_session = create(:game_session, :cashed_out)

      expect(GameSession.active).to include(active_session)
      expect(GameSession.active).not_to include(cashed_out_session)
    end
  end
end
