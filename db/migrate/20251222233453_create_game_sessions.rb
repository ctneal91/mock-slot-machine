class CreateGameSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :game_sessions do |t|
      t.string :session_token, null: false
      t.integer :credits, default: 10, null: false
      t.boolean :cashed_out, default: false, null: false

      t.timestamps
    end

    add_index :game_sessions, :session_token, unique: true
  end
end
