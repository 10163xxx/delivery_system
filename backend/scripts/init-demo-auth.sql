insert into auth_accounts (
  id,
  username,
  password_hash,
  role,
  display_name,
  linked_profile_id,
  created_at
) values
  ('usr-admin-1', 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin', '总控台管理员', 'admin-1', now()),
  ('usr-cust-1', 'cust_1', '4f21b18a4c743a5da01bb3a4955dea0a0294a0b4f7977b454c7259e37b2e6c19', 'customer', '用户 10001', 'cust-1', now()),
  ('usr-cust-2', 'cust_2', '4f21b18a4c743a5da01bb3a4955dea0a0294a0b4f7977b454c7259e37b2e6c19', 'customer', '用户 10002', 'cust-2', now()),
  ('usr-rider-1', 'rider_1', 'e85978062768502c68bfd953d2d3793cf799b6abe697543512d8bc41bc60e210', 'rider', '陈凯', 'rider-1', now()),
  ('usr-rider-2', 'rider_2', 'e85978062768502c68bfd953d2d3793cf799b6abe697543512d8bc41bc60e210', 'rider', '赵晨', 'rider-2', now()),
  ('usr-merchant-1', 'merchant_wang', '0e3183c45e8ef9bc95fc8a2dc83f040149d2c7193312aa0740da9c0d50b1f439', 'merchant', '王师傅', 'merchant-1', now()),
  ('usr-merchant-2', 'merchant_su', '0e3183c45e8ef9bc95fc8a2dc83f040149d2c7193312aa0740da9c0d50b1f439', 'merchant', '苏宁', 'merchant-2', now())
on conflict (username) do nothing
