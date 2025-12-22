FactoryBot.define do
  factory :game_session do
    session_token { "MyString" }
    credits { 1 }
    cashed_out { false }
  end
end
