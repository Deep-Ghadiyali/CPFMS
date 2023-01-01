namespace CPFMS.Application.Entities.Base
{
	public class Money
	{
		private static readonly int _precision = 2;
		private decimal _amount = 0m;

		public Money(decimal amount = 0m)
		{
			_amount = Math.Round(amount, _precision, MidpointRounding.AwayFromZero);
		}

		public decimal Value
		{
			get { return _amount; }
			set { _amount = Math.Round(value, _precision, MidpointRounding.AwayFromZero); }
		}

		public string ValueAsString
		{
			get { return _amount.ToString("0.00"); }
		}

		public static Money operator + (Money m1, Money m2)
		{
			return new Money(m1.Value + m2.Value);
		}

	}
}
