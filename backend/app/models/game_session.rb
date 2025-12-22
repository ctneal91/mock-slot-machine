class GameSession < ApplicationRecord
  validates :session_token, presence: true, uniqueness: true
  validates :credits, presence: true, numericality: { greater_than_or_equal_to: 0 }

  before_validation :generate_session_token, on: :create

  scope :active, -> { where(cashed_out: false) }

  def can_play?
    !cashed_out && credits >= 1
  end

  private

  def generate_session_token
    self.session_token ||= SecureRandom.hex(16)
  end
end
