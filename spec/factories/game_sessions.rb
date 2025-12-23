FactoryBot.define do
  factory :game_session do
    sequence(:session_token) { |n| SecureRandom.hex(16) }
    credits { 10 }
    cashed_out { false }

    trait :low_credits do
      credits { 5 }
    end

    trait :medium_credits do
      credits { 50 }
    end

    trait :high_credits do
      credits { 70 }
    end

    trait :no_credits do
      credits { 0 }
    end

    trait :cashed_out do
      cashed_out { true }
    end
  end
end
