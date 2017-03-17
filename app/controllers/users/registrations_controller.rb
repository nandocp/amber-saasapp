class Users::RegistrationsController < Devise::RegistrationsController #extending Devise registration process
  def create
    super do |resource| #'super' will inherit the "create" action and extend it, and 'resource' is equivalent to the user
      if params[:plan] #Checks to see if there's a parameter called plan in the URL.
        resource.plan_id = params[:plan]
        if resource.plan_id == 2
          resource.save_with_subscription
        else
          resource.save
        end
      end  
    end
  end
end