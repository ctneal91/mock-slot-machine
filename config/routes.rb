Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :game_sessions, only: [ :create ], param: :session_token do
        member do
          get "", action: :show
          post "roll"
          post "cash_out"
        end
      end
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # Serve React frontend for all non-API routes
  get "*path", to: "frontend#index", constraints: ->(req) { !req.path.start_with?("/api") }
  root "frontend#index"
end
