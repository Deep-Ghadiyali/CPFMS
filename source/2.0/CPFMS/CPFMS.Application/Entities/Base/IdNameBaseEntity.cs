namespace CPFMS.Application.Entities.Base
{
	public class IdNameBaseEntity : BaseEntity
	{
		public int Id { get; set; } = 0;
		public string Name { get; set; }

		public bool IsValid()
		{
			return Id > 0 || !string.IsNullOrEmpty(Name);
		}
	}
}
