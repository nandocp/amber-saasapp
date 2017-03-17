class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  belongs_to :plan
  
  attr_accessor :stripe_card_token
  def save_with_subscription
    if valid? #Line that calls Stripe and charge the customer with its subscription plan
      customer = Stripe::Customer.create(description: email, plan: plan_id, card: stripe_card_token) #Will create a subscription, a record of a monthly subscription, calling back rails site, returning an object, saving it in a variable 'customer', generating the customerToken
      self.stripe_customer_token = customer.id
      save!
    end
  end
end
