namespace CPFMS.Application.Entities.Base
{
	public class BalanceBaseEntity : BaseEntity
	{
		public BalanceType BalanceType { get; set; }
		public Money Balance { get; set; }
	}
}
