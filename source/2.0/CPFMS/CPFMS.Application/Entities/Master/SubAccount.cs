using CPFMS.Application.Entities.Base;

namespace CPFMS.Application.Entities.Master
{
	public class SubAccount : IdNameBaseEntity
	{
		public string Address { get; set; }
		public string Remark { get; set; }
		public Account Account { get; set; }
	}

	#region Entities used for SubAccountDetails
	public class CowDetails : BaseEntity
	{
		public CowCast CowCast { get; set; }
		public DateOnly IssueDate { get; set; }
		public DateOnly BirthDate { get; set; }
		public decimal BirthWeight { get; set; }
		public DateOnly JoinDate { get; set; }
		public decimal JoinWeight { get; set; }
		public DateOnly HeiferDate { get; set; }
		public DateOnly CalwingDate { get; set; }
		public decimal CalwingLiter { get; set; }
		public DateOnly CancelDate { get; set; }
		public DateOnly DeathDate { get; set; }
	}

	public class SubAccountBalanceDetails : BaseEntity
	{
		public BalanceBaseEntity OpeningAccountBalance { get; set; }
		public BalanceBaseEntity ClosingAccountBalance { get; set; }
		public Money CRAmount { get; set; }
		public Money DRAmount { get; set; }
	}

	public class Insurance : BaseEntity
	{
		public DateOnly Date { get; set; }
		public DateOnly DueOnDate { get; set; }
		public string TagNo { get; set; }
		public Money Amount { get; set; }
	}
	#endregion

	public class SubAccountDetails : BaseEntity
	{
		public SubAccount SubAccount { get; set; }
		public Organization Organization { get; set; }
		public ResourcePerson ResourcePerson { get; set; }
		public CowDetails CowDetails { get; set; }
		public SubAccountBalanceDetails SubAccountBalance { get; set; }
		public Insurance Insurance { get; set; }
	}
}
