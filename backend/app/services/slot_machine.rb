class SlotMachine
  SYMBOLS = %w[C L O W].freeze # Cherry, Lemon, Orange, Watermelon
  REWARDS = {
    'C' => 10,  # Cherry
    'L' => 20,  # Lemon
    'O' => 30,  # Orange
    'W' => 40   # Watermelon
  }.freeze

  REROLL_CHANCE_MEDIUM = 0.30  # 30% chance to re-roll when credits 40-60
  REROLL_CHANCE_HIGH = 0.60   # 60% chance to re-roll when credits > 60
  MEDIUM_CREDIT_THRESHOLD = 40
  HIGH_CREDIT_THRESHOLD = 60

  attr_reader :result, :win, :reward

  def initialize(game_session, random: Random.new)
    @game_session = game_session
    @random = random
    @result = []
    @win = false
    @reward = 0
  end

  def spin!
    raise "Cannot play: insufficient credits or session cashed out" unless @game_session.can_play?

    @result = roll_symbols
    @win = winning_roll?(@result)

    if @win && should_reroll?
      @result = roll_symbols
      @win = winning_roll?(@result)
    end

    calculate_reward
    update_credits

    {
      result: @result,
      win: @win,
      reward: @reward,
      credits: @game_session.credits
    }
  end

  private

  def roll_symbols
    3.times.map { SYMBOLS.sample(random: @random) }
  end

  def winning_roll?(symbols)
    symbols.uniq.length == 1
  end

  def should_reroll?
    credits = @game_session.credits

    reroll_chance = if credits > HIGH_CREDIT_THRESHOLD
                      REROLL_CHANCE_HIGH
                    elsif credits >= MEDIUM_CREDIT_THRESHOLD
                      REROLL_CHANCE_MEDIUM
                    else
                      0
                    end

    @random.rand < reroll_chance
  end

  def calculate_reward
    @reward = @win ? REWARDS[@result.first] : 0
  end

  def update_credits
    if @win
      @game_session.update!(credits: @game_session.credits + @reward - 1)
    else
      @game_session.update!(credits: @game_session.credits - 1)
    end
  end
end
